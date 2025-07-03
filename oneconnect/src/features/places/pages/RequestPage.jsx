import { CardRequestSelected } from "../components/request-page/CardRequestSelected";
import { FormProvider } from "../context/FormContext";

export const RequestPage = () => {
  return (
    <FormProvider>
      <CardRequestSelected />
    </FormProvider>
  );
};
