import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    title: Yup.string()
      .required("Please enter title")
      .max(50),
    start: Yup.date().required("Please select start date"),
    end: Yup.date().required("Please select end date"),
    desc: Yup.string().required("Please enter description"),
    event_color: Yup.string().required("Please select color")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    title: "",
    desc: "",
    start: new Date(),
    end: new Date(),
    allDay: false,
    event_color: "#2e3a44",
    recurring_event: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomerEventValidation",
  enableReinitialize: true
});

export default formikEnhancer;
