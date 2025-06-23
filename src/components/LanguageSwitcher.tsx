
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    // <Button
    //   variant="outline"
    //   size="sm"
    //   onClick={() => setLanguage(language === 'vi' ? 'ja' : 'vi')}
    //   className="flex items-center gap-2 bg-japanese-washi/50 border-primary/30 hover:bg-primary/10 transition-all duration-300"
    // >
    //   <Globe size={16} className="text-primary" />
    //   <span className="font-japanese text-sm">
    //     {language === 'vi' ? '日本語' : 'Tiếng Việt'}
    //   </span>
    // </Button>
    <></>
  );
};

export default LanguageSwitcher;
