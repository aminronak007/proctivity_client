import { withFormik } from "formik";
import * as Yup from "yup";
Yup.addMethod(Yup.array, "unique", function(message) {
  return this.test("unique", message, function(list) {
    const mapper = x => x.name?.toLowerCase();
    const set = [...new Set(list.map(mapper))];
    const isUnique = list.length === set.length;
    if (isUnique) {
      return true;
    }
    return this.createError({
      path: `statusName`,
      message: message
    });
  });
});
const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Please enter group name"),
    status: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Please enter status name")
        })
      )
      .unique("Please provide a unique status name")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    name: "",
    status: [{ position: 1, name: "" }],
    deleted_status: []
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});
export default formikEnhancer;
