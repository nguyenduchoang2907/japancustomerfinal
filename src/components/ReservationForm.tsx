
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TableAllocationDialog from "./TableAllocationDialog";
import { useLanguage } from "@/context/LanguageContext";
import { useAppSelector } from "../redux/hooks";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import  orderApi  from "@/api/orderApi"; // ✅ đảm bảo bạn đã import đúng
import { OrderType } from "@/types/order";


const formSchema = z.object({
  name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
  date: z.date({ required_error: "Vui lòng chọn ngày" }),
  reservation_time: z.string({ required_error: "Vui lòng chọn giờ" }),
  guests: z.string({ required_error: "Vui lòng chọn số khách" }),
  notes: z.string().optional(),
  tables: z.array(z.number()).optional(),
});

const guestOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

const ReservationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [currentGuestCount, setCurrentGuestCount] = useState<number>(0);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAppSelector((state) => state.auth);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      notes: "",
      tables: [],
    },
  });

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  setIsSubmitting(true);
  const reservationDateTime = dayjs(values.date)
  .hour(Number(values.reservation_time.split(":")[0]))
  .minute(Number(values.reservation_time.split(":")[1]))
  .second(0)
  .toISOString();

  try {
const payload = {
  customer_id: user?.customer.customer_id,
  guest_count: Number(values.guests),
  order_type: "reservation" as const,
  order_date: new Date().toISOString(), // ✅ thời điểm tạo đơn
  reservation_time: reservationDateTime, // ✅ lúc khách muốn tới
  table_ids: values.tables || [],
  note: values.notes || "",
  order_items: [],
};

    await orderApi.create(payload); // gọi API thật

    toast({
      title: "Đặt bàn thành công!",
      description: `Đã đặt bàn cho ${values.guests} khách vào lúc ${values.reservation_time}, ngày ${format(values.date, "dd/MM/yyyy")}`,
    });

    form.reset({
      guests: "",
      notes: "",
      tables: [],
    });
  } catch (error) {
    toast({
      title: "Lỗi đặt bàn",
      description: "Đã xảy ra lỗi khi đặt bàn. Vui lòng thử lại.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  const handleGuestChange = (value: string) => {
    form.setValue("guests", value);
    const guestCount = parseInt(value.replace("+", ""), 10);
    setCurrentGuestCount(guestCount);
    setShowTableDialog(true);
  };

  const handleTableSelection = (selectedTables: number[]) => {
    form.setValue("tables", selectedTables);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fullName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterName")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phone")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterPhone")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Guests */}
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("guests")}</FormLabel>
                  <Select
                    onValueChange={handleGuestChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectGuests")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {guestOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option === "10+" ? "10+ người" : `${option} người`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("date")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "dd/MM/yyyy")
                            : t("selectDate")}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time */}
            <FormField
              control={form.control}
              name="reservation_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("reservation_time")}</FormLabel>
                  <FormControl>
                    <TimePicker
                      format="HH:mm"
                      minuteStep={15}
                      className="w-full"
                      onChange={(value) => {
                        if (value) {
                          field.onChange(value.format("HH:mm"));
                        }
                      }}
                      value={field.value ? dayjs(field.value, "HH:mm") : null}
                      placeholder={t("selectTime")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tables */}
          <FormField
            control={form.control}
            name="tables"
            render={() => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{t("selectedTables")}</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTableDialog(true)}
                  >
                    {t("selectTables")}
                  </Button>
                </div>
                <FormControl>
                  <div className="p-2 border rounded-md bg-gray-100 min-h-[40px]">
                    {form.watch("tables")?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {form.watch("tables")?.map((table) => (
                          <div
                            key={table}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
                          >
                            Bàn {table}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Chưa chọn bàn
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("notes")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("enterNotes")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("processing") : t("submit")}
          </Button>
        </form>
      </Form>

      <TableAllocationDialog
        isOpen={showTableDialog}
        onClose={() => setShowTableDialog(false)}
        guest_count={currentGuestCount}
        onConfirm={handleTableSelection}
      />
    </>
  );
};

export default ReservationForm;
