import { Package } from "lucide-react";
import MaterialRegistrationForm from "@/components/MaterialRegistrationForm";

const MaterialRegistration = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-20 py-4">
      <div>
        <Package className="mx-auto h-12 w-12 text-blue-600" />
        <h1 className="text-3xl font-bold my-4">Cadastro de Materiais</h1>
        <p>Preencha os detalhes do produto abaixo</p>
      </div>
      <div className="shadow-lg rounded-lg p-6 md:w-xl">
        <MaterialRegistrationForm />
      </div>
    </div>
  );
};

export default MaterialRegistration;
