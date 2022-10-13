import { Icon } from "~/components/Icon";
import { addDays, subDays, format, formatISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const DateSelect = ({ currentDate, onChange }) => {
  const prevDay = () => {
    const nextDate = subDays(new Date(currentDate), 1);
    onChange(formatISO(nextDate));
  };
  const nextDay = () => {
    const nextDate = addDays(new Date(currentDate), 1);
    onChange(formatISO(nextDate));
  };

  return (
    <div className="p-4 flex space-x-4 items-center justify-center">
      <Icon name="arrowLeft" className="w-6" onClick={prevDay} />
      <span className="font-bold text-red-300">
        {format(new Date(currentDate), "d 'de' MMMM", { locale: ptBR })}
      </span>
      <Icon name="arrowRight" className="w-6" onClick={nextDay} />
    </div>
  );
};
