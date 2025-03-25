import "./TestRoute.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

const TestRoute = ({ className }) => {
  return (
    <div className={`test-route${className ? " " + className : ""}`}>
      <h2>Test Form</h2>
      <form className="mb-3">
        <div className="form-field-group">
          <label for="nativeInput" className="form-label">
            Native uncontrolled input
          </label>
          <input type="text" id="nativeInput" className="form-control" />
        </div>
        <div className="form-field-group">
          <label for="nativeSelect" className="form-label">
            Native uncontrolled select
          </label>
          <select id="nativeSelect" className="form-control" value="">
            <option value="" disabled>
              Choose Brand
            </option>
            <option>Ford</option>
            <option>Toyota</option>
            <option>Hyundai</option>
          </select>
        </div>
        <div className="form-field-group">
          <label for="nativeInput" className="form-label">
            Native controlled input
          </label>
          <input type="text" id="nativeInput" className="form-control" />
        </div>
        <div className="form-field-group">
          <label for="nativeSelect" className="form-label">
            Native controlled select
          </label>
          <select id="nativeSelect" className="form-control" value="">
            <option value="" disabled>
              Choose Brand
            </option>
            <option>Ford</option>
            <option>Toyota</option>
            <option>Hyundai</option>
          </select>
        </div>
        <Input label="Custom uncontrolled input" id="userWeight" />
      </form>
      <div className="d-flex gap-2">
        <Button type="button" onClick={() => {}}>
          Отмена
        </Button>
        <Button type="button" onClick={() => {}}>
          Отправить
        </Button>
      </div>
    </div>
  );
};

export default TestRoute;
