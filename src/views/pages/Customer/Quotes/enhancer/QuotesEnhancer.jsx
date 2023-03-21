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
      path: `item_name`,
      message: message
    });
  });
});
const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    line_items: Yup.array().of(
      Yup.object().shape({
        item_name: Yup.string().required("Please enter item name"),
        item_price: Yup.string()
          .required("Please enter price")
          .matches(/^[0-9]*.[0-9]{0,2}$/, "Please enter valid price"),
        item_quantity: Yup.string()
          .required("Please enter quantity")
          .matches(/^[0-9]*$/, "Please enter valid quantity")
      })
    )
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    EXGST: "",
    line_items: [
      { position: 1, item_name: "", item_price: "", item_quantity: "" }
    ],
    deleted_item: []
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});
export default formikEnhancer;
