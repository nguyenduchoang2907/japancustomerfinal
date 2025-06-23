import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table as UITable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { CheckCircle, Circle } from "lucide-react";
import tableApi from "@/api/tableApi";
import { Table as TableType } from "@/types/table";

interface TableOption {
  id: number;
  name: string;
  capacity: number;
  available: boolean;
}

interface TableAllocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  guest_count: number;
  onConfirm: (selectedTables: number[]) => void;
}

const TableAllocationDialog = ({
  isOpen,
  onClose,
  guest_count,
  onConfirm,
}: TableAllocationDialogProps) => {
  const [tables, setTables] = useState<TableOption[]>([]);
  const [selectedTables, setSelectedTables] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      tableApi.getAll().then((data: TableType[]) => {
        const mapped = data
          .filter((t) => t.status === "available")
          .map<TableOption>((t) => ({
            id: t.table_id,
            name: `Bàn ${t.table_number} (Tầng ${t.floor ?? 1})`,
            capacity: t.seat_count,
            available: true,
          }));
        setTables(mapped);

        const optimal = [...mapped]
          .filter((t) => t.capacity >= guest_count)
          .sort((a, b) => a.capacity - b.capacity);
        setSelectedTables(optimal.length > 0 ? [optimal[0].id] : []);
      });
    } else {
      setSelectedTables([]);
    }
  }, [isOpen, guest_count]);

  const selectedCapacity = tables
    .filter((t) => selectedTables.includes(t.id))
    .reduce((sum, t) => sum + t.capacity, 0);

  const handleTableToggle = (tableId: number) => {
    const isSelected = selectedTables.includes(tableId);
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;

    const newCapacity = isSelected
      ? selectedCapacity - table.capacity
      : selectedCapacity + table.capacity;

    if (!isSelected && newCapacity > 2 * guest_count) return;

    setSelectedTables((prev) =>
      isSelected ? prev.filter((id) => id !== tableId) : [...prev, tableId]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedTables);
    onClose();
  };

  const isConfirmDisabled =
    selectedCapacity < guest_count || selectedCapacity > 2 * guest_count;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Phân bố bàn</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-4">
            Vui lòng chọn bàn cho {guest_count} khách.{" "}
            <span className="font-medium text-primary">
              Đã chọn: {selectedCapacity} chỗ
            </span>
          </p>

          <div className="border rounded-md max-h-[300px] overflow-auto">
            <UITable>
              <TableHeader>
                <TableRow>
                  <TableHead>Bàn</TableHead>
                  <TableHead>Sức chứa</TableHead>
                  <TableHead className="text-right">Chọn</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => (
                  <TableRow
                    key={table.id}
                    className={`cursor-pointer ${
                      selectedTables.includes(table.id) ? "bg-primary/10" : ""
                    }`}
                    onClick={() => handleTableToggle(table.id)}
                  >
                    <TableCell>{table.name}</TableCell>
                    <TableCell>{table.capacity} người</TableCell>
                    <TableCell className="text-right">
                      {selectedTables.includes(table.id) ? (
                        <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground ml-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </UITable>
          </div>

          {selectedCapacity < guest_count && (
            <p className="mt-2 text-sm text-destructive">
              Chưa đủ chỗ cho {guest_count} khách. Vui lòng chọn thêm bàn.
            </p>
          )}
          {selectedCapacity > 2 * guest_count && (
            <p className="mt-2 text-sm text-destructive">
              Bạn đã chọn quá nhiều chỗ ({selectedCapacity} người). Vui lòng giảm bớt bàn.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={isConfirmDisabled}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableAllocationDialog;
