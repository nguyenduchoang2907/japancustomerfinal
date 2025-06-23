
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";
import ReservationForm from "@/components/ReservationForm";
import { useLanguage } from "@/context/LanguageContext";

const Reservation = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-primary/10 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="japanese-title text-3xl md:text-4xl font-bold mb-4">{t('reservationTitle')}</h1>
            <p className="japanese-text text-japanese-stone max-w-2xl mx-auto">
              {t('reservationSubtitle')}
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="japanese-title text-2xl font-bold mb-6">{t('reservationInfo')}</h2>
              <ReservationForm />
            </div>
            
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="japanese-title text-2xl font-bold mb-6">{t('openingHours')}</h2>
                <div className="japanese-card bg-japanese-washi p-6 border border-japanese-sakura/20">
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 font-japanese text-japanese-sumi">{t('weekdays')}</h3>
                    <p className="japanese-text text-japanese-stone">
                      <span className="block">{t('lunch')}: 11:00 - 14:00</span>
                      <span className="block">{t('dinner')}: 17:00 - 22:00</span>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 font-japanese text-japanese-sumi">{t('weekend')}</h3>
                    <p className="japanese-text text-japanese-stone">
                      <span className="block">{t('lunch')}: 10:00 - 15:00</span>
                      <span className="block">{t('dinner')}: 17:00 - 23:00</span>
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="japanese-title text-2xl font-bold mb-6">{t('reservationPolicy')}</h2>
                  <div className="japanese-card bg-japanese-washi p-6 border border-japanese-sakura/20">
                    <ul className="space-y-4 japanese-text text-japanese-stone">
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{t('policy1')}</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{t('policy2')}</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{t('policy3')}</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{t('policy4')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 japanese-card bg-primary/10 p-6 border border-primary/20">
                <h3 className="japanese-title font-bold text-xl mb-3">{t('needSupport')}</h3>
                <p className="mb-4 japanese-text">{t('contactUs')}</p>
                <p className="font-semibold font-japanese">☎️ (84) 123-456-789</p>
                <p className="font-semibold font-japanese">✉️ sakura@restaurant.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reservation;
