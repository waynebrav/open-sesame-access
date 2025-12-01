import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Ticket {
  id: string;
  subject: string;
  email: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  message: string;
  sender_type: string;
  created_at: string;
}

const SupportTicketsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['admin-tickets', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Ticket[];
    },
  });

  const { data: messages } = useQuery({
    queryKey: ['ticket-messages', selectedTicket?.id],
    enabled: !!selectedTicket,
    queryFn: async () => {
      if (!selectedTicket) return [];
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', selectedTicket.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Message[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: string }) => {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status })
        .eq('id', ticketId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      toast({ title: "Ticket status updated" });
    },
  });

  const sendReplyMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTicket || !replyMessage.trim()) return;
      
      const { error } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: selectedTicket.id,
          message: replyMessage,
          sender_type: 'admin',
        });
      
      if (error) throw error;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-messages', selectedTicket?.id] });
      setReplyMessage("");
      toast({ title: "Reply sent successfully" });
      
      // Send email notification
      if (selectedTicket) {
        await supabase.functions.invoke('send-email', {
          body: {
            to: [selectedTicket.email],
            subject: `Re: ${selectedTicket.subject}`,
            html: `
              <h2>Response to your support ticket</h2>
              <p><strong>Subject:</strong> ${selectedTicket.subject}</p>
              <p><strong>Response:</strong></p>
              <p>${replyMessage}</p>
              <p>You can view and reply to this ticket by logging into your account.</p>
            `,
          },
        });
      }
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Open</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800"><MessageSquare className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800"><CheckCircle2 className="h-3 w-3 mr-1" />Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800"><XCircle className="h-3 w-3 mr-1" />Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Support Tickets</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tickets</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading tickets...</div>
      ) : (
        <div className="grid gap-4">
          {tickets?.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                      <span className="text-xs text-muted-foreground">
                        {ticket.category}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      From: {ticket.email} • {new Date(ticket.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{ticket.subject}</DialogTitle>
                          <div className="flex gap-2 mt-2">
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <Select
                              value={ticket.status}
                              onValueChange={(value) =>
                                updateStatusMutation.mutate({ ticketId: ticket.id, status: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="border rounded-lg p-4 max-h-96 overflow-y-auto space-y-4">
                            {messages?.map((msg) => (
                              <div
                                key={msg.id}
                                className={`p-3 rounded-lg ${
                                  msg.sender_type === 'admin'
                                    ? 'bg-blue-50 ml-8'
                                    : 'bg-gray-50 mr-8'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-xs font-medium">
                                    {msg.sender_type === 'admin' ? 'Admin' : 'Customer'}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(msg.created_at).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm">{msg.message}</p>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Reply to Customer</label>
                            <Textarea
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              placeholder="Type your response..."
                              rows={4}
                            />
                            <Button
                              onClick={() => sendReplyMutation.mutate()}
                              disabled={!replyMessage.trim() || sendReplyMutation.isPending}
                              className="w-full"
                            >
                              Send Reply
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportTicketsManagement;