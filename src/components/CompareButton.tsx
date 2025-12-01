import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CompareButtonProps {
  productId: string;
}

const CompareButton: React.FC<CompareButtonProps> = ({ productId }) => {
  const navigate = useNavigate();
  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('compareList');
    if (stored) {
      setCompareList(JSON.parse(stored));
    }
  }, []);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let updatedList = [...compareList];
    
    if (updatedList.includes(productId)) {
      updatedList = updatedList.filter(id => id !== productId);
      toast.info("Removed from comparison");
    } else {
      if (updatedList.length >= 4) {
        toast.error("You can compare up to 4 products only");
        return;
      }
      updatedList.push(productId);
      toast.success("Added to comparison");
    }

    setCompareList(updatedList);
    localStorage.setItem('compareList', JSON.stringify(updatedList));
  };

  const goToComparison = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (compareList.length < 2) {
      toast.error("Please select at least 2 products to compare");
      return;
    }

    navigate(`/comparison?ids=${compareList.join(',')}`);
  };

  const isInCompareList = compareList.includes(productId);
  const hasItemsToCompare = compareList.length >= 2;

  return (
    <div className="flex gap-2">
      <Button
        variant={isInCompareList ? "default" : "outline"}
        size="sm"
        onClick={toggleCompare}
        className="flex-1"
      >
        <Scale className="h-4 w-4 mr-1" />
        {isInCompareList ? "Remove" : "Compare"}
      </Button>
      {hasItemsToCompare && (
        <Button
          variant="secondary"
          size="sm"
          onClick={goToComparison}
        >
          Go ({compareList.length})
        </Button>
      )}
    </div>
  );
};

export default CompareButton;
