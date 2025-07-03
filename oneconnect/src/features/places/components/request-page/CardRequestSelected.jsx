import { Card, Flex, Button } from "antd";
import { useState } from "react";
import { CreatePlaceStep } from "./CreatePlaceStep";
import { SelectedPlaceStep } from "./SelectedPlaceStep";

export const CardRequestSelected = () => {
  const [requestSelected, setRequestSelected] = useState(0);
  const [step, setStep] = useState(0); // 0 = select, 1 = show step

  const renderStepComponent = () => {
    if (requestSelected === 0) {
      return <SelectedPlaceStep />;
    } else {
      return <CreatePlaceStep />;
    }
  };

  return (
    <div>
      {step === 0 ? (
        <>
          <h1>กรุณาเลือกสถานที่ที่ต้องการขอใช้บริการ</h1>
          <Flex className="h-[350px]" justify="center" align="center" gap={16}>
            <Button
              onClick={() => setRequestSelected(0)}
              type={requestSelected === 0 ? "primary" : "default"}
            >
              เลือกเมือง
            </Button>
            <Button
              onClick={() => setRequestSelected(1)}
              type={requestSelected === 1 ? "primary" : "default"}
            >
              ส่งคำขอเพื่อสร้างเมือง
            </Button>
          </Flex>
          <div className="flex justify-end">
            <Button type="primary" onClick={() => setStep(1)}>
              ต่อไป
            </Button>
          </div>
        </>
      ) : (
        <div className="">
          <div className="mb-5">
            <Button className="" onClick={() => setStep(0)}>
              กลับ
            </Button>
          </div>
          {renderStepComponent()}
        </div>
      )}
    </div>
  );
};
