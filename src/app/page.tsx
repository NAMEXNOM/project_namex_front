import Image from "next/image";
import { Button } from "primereact/button";

export default function Home() {
  return (
    <div className="text-lg">
      HOLA DESDE HOME
      <div className="card flex justify-center">
        <Button label="Check" icon='pi pi-check'/>
      </div>
    </div>
  );
}
