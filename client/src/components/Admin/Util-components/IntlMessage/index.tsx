import { useTranslation } from "react-i18next";

const IntlMessage = ({ id, fallback }: { id: any; fallback?: any }) => {
  const { t } = useTranslation();

  const translate = t(id, fallback);

  return <>{translate}</>;
};

export default IntlMessage;
