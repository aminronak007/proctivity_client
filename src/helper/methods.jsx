import moment from "moment-timezone";
import CryptoAES from "crypto-js/aes";
import CryptoENC from "crypto-js/enc-utf8";

export const randomUUID = () => {
  return (
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1) +
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  );
};

export const subtaskTicket = () => {
  return (
    "#" +
    Math.floor((1 + Math.random()) * 0x1000)
      .toString(16)
      .substring(1) +
    Math.floor((1 + Math.random()) * 0x1000)
      .toString(16)
      .substring(1)
  );
};

export const dateFormat = dt => {
  let date_and_time = new Date(dt);
  let momen_date_and_time = moment(date_and_time);
  return momen_date_and_time
    .tz(process.env.REACT_APP_TIMEZONE)
    .format("MMMM Do, h:mm a");
};

export const onlyDate = dt => {
  let date_and_time = new Date(dt);
  let momen_date_and_time = moment(date_and_time);
  return momen_date_and_time
    .tz(process.env.REACT_APP_TIMEZONE)
    .format("MMM Do");
};

export const datesWithYear = dt => {
  let date_and_time = new Date(dt);
  let momen_date_and_time = moment(date_and_time);
  return momen_date_and_time
    .tz(process.env.REACT_APP_TIMEZONE)
    .format("MMM Do YYYY");
};

export const decryptPlainText = ciphertext => {
  try {
    var bytes = CryptoAES.decrypt(
      ciphertext,
      process.env.REACT_APP_CRYPTO_SECRET_KEY
    );
    return bytes.toString(CryptoENC);
  } catch (error) {
    console.log(error);
  }
};

export const encryptPlainText = plainText => {
  try {
    return CryptoAES.encrypt(
      plainText,
      process.env.REACT_APP_CRYPTO_SECRET_KEY
    ).toString();
  } catch (error) {
    console.log(error);
  }
};

export const decryptJSONObject = ciphertext => {
  try {
    var bytes = CryptoAES.decrypt(
      ciphertext,
      process.env.REACT_APP_CRYPTO_SECRET_KEY
    );
    return JSON.parse(bytes.toString(CryptoENC));
  } catch (error) {
    console.log(error);
  }
};
export const encryptJSONObject = plainText => {
  try {
    return CryptoAES.encrypt(
      JSON.stringify(plainText),
      process.env.REACT_APP_CRYPTO_SECRET_KEY
    ).toString();
  } catch (error) {
    console.log(error);
  }
};

export const check_permission = (modules, permission, data) => {
  for (let i = 0; i < data?.length; i++) {
    const row = data[i];
    if (row.module === modules && row[permission] === 1) {
      return true;
    }
  }
  return false;
};

export const check_file_size = (file, size) => {
  var numb = file.size / 1024 / 1024;
  numb = numb.toFixed(2);
  if (numb > size) {
    return true;
  } else {
    return false;
  }
};
export const GetTheTime = dt => {
  let date_and_time = new Date(dt);
  let momen_date_and_time = moment(date_and_time);
  console.log(
    dt,
    date_and_time,
    date_and_time.toLocaleString("en-AU", {
      timeZone: process.env.REACT_APP_TIMEZONE
    })
    // momen_date_and_time,
    // momen_date_and_time.tz(process.env.REACT_APP_TIMEZONE),
    // momen_date_and_time.format("DD-MM-YYYY hh:mm a"),
    // moment(dt).format("DD-MM-YYYY hh:mm a")
  );
  return (
    momen_date_and_time
      // .tz(process.env.REACT_APP_TIMEZONE)
      .format("DD-MM-YYYY hh:mm a")
  );
};
