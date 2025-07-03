import { Form, Input, Row, Col } from "antd";
import { useForm } from "../../../context/FormContext";
const CreatePageStepOne = () => {
  const { formData, updateFormData } = useForm();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="flex justify-center gap-5 my-10">
      <Form layout="vertical">
        <Row gutter={20}>
          <Col>
            <Form.Item label="หน่วยงาน" name="agency">
              <Input
                name="agency"
                value={formData.agency || ""}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label="จังหวัด" name="province">
              <Input
                name="province"
                value={formData.province || ""}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label="อำเภอ" name="district">
              <Input
                name="district"
                value={formData.district || ""}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label="ละติจูด" name="latitude">
              <Input
                name="latitude"
                value={formData.latitude || ""}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="ตำบล" name="subdistrict">
              <Input
                name="subdistrict"
                value={formData.subdistrict || ""}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label="รหัสไปรษณีย์" name="zipCode">
              <Input
                name="zipCode"
                value={formData.zipCode || ""}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label="จำนวนประชากร" name="population">
              <Input
                name="population"
                value={formData.population || ""}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label="ลองจิจูด" name="longitude">
              <Input
                name="longitude"
                value={formData.longitude || ""}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreatePageStepOne;
