import { useState } from "react";
import "./App.css";

// Helper function to remove diacritics and convert to uppercase
const removeDiacritics = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
};

function App() {
  const [idCard, setIdCard] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [gender, setGender] = useState("male");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "idCard":
        setIdCard(value);
        break;
      case "name":
        setName(value);
        break;
      case "dateOfBirth":
        setDateOfBirth(value);
        break;
      case "expirationDate":
        setExpirationDate(value);
        break;
      case "gender":
        setGender(value);
        break;
      default:
        break;
    }
  };

  const generateCode = () => {
    // Lấy 9 số cuối của ID card
    const last9DigitsOfIdCard = idCard.slice(-9);

    // Tạo số nguyên ngẫu nhiên
    const random1 = Math.floor(Math.random() * 10);
    const random2 = Math.floor(Math.random() * 10);
    const random3 = Math.floor(Math.random() * 10);
    const random4 = Math.floor(Math.random() * 10);

    // Đảo ngược chuỗi ngày sinh
    const reversedDate = dateOfBirth.replace(
      /(\d{2})\/(\d{2})\/(\d{4})/,
      "$3-$2-$1"
    );
    const reversedDateParts = reversedDate.split("-");
    const twoDigitYears = reversedDateParts[0].substr(-2);
    const reversedDateYYMMDD =
      twoDigitYears + reversedDateParts[1] + reversedDateParts[2];

    // Định dạng ngày hết hạn
    const formattedExpirationDate = expirationDate.replace(
      /(\d{2})\/(\d{2})\/(\d{4})/,
      "$3-$2-$1"
    );
    const formattedExpirationDateParts = formattedExpirationDate.split("-");
    const formattedExpirationDateDDMM =
      formattedExpirationDateParts[2] + formattedExpirationDateParts[1];
    const twoDigitYear = formattedExpirationDateParts[0].substr(-2);
    const formattedExpirationDateDDMMYY = formattedExpirationDateDDMM + twoDigitYear;

    // Xử lý tên để loại bỏ dấu và chuyển thành chữ in hoa
    const formattedName = removeDiacritics(name).split(" ");
    const formattedNameWithSymbols = formattedName
      .map((part, index) => (index < 1 ? `${part}<` : `<${part}`))
      .join("");

      //kiểm tra ký tự nhập 
      const currentLength = formattedNameWithSymbols.length;

    // tính toán số kí tư
    const charactersToAd =  30 - currentLength;

  //nối thêm dấu cho đuôi tên
  const additionalSymbol = "<".repeat(charactersToAd)
  //
  const formattedNameWithSymbolsAndSymbols = formattedNameWithSymbols + additionalSymbol;
    // Xác định ký tự giới tính
    const genderChar = gender === "male" ? "M" : "F";

    // Tạo mã IDVNM
    const idvnmCode = `
    IDVNM${last9DigitsOfIdCard}${random1}${idCard}<<${random2}
    ${reversedDateYYMMDD}${random3}${genderChar}${formattedExpirationDateDDMMYY}${random4}VNM<<<<<<<<<<<${random1}
    ${formattedNameWithSymbolsAndSymbols}
  `;

  // Remove newlines and spaces
  const idvnmCodeCleaned = idvnmCode.replace(/\s+/g, "");

  const idvnmCodeParts = [];

  // Create parts with maximum length of 30 characters
  for (let i = 0; i < idvnmCodeCleaned.length; i += 30) {
    idvnmCodeParts.push(idvnmCodeCleaned.slice(i, i + 30));
  }
const idvnmCodeFormatted = idvnmCodeParts.join("\n");
    setGeneratedCode(idvnmCodeFormatted);
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="App">
      <h1 className="color-red">MRZ.TA19DC</h1>

      <div className="d-flex">
      <div className="div__left">
      <div className="container__form-input input-fields">
        <div className="container__form--div">
        <label className="label__title">ID Card:</label>
        <input
          className="input__form"
          type="text"
          name="idCard"
          value={idCard}
          onChange={handleInputChange}
        />
        </div>
      <div className="container__form--div">
      <label className="label__title">Họ và Tên:</label>
        <input
          className="input__form"
          type="text"
          name="name"
          value={name}
          onChange={handleInputChange}
        />
      </div>
        
      <div className="container__form--div">
      <label className="label__title">Ngày Sinh:</label>
        <input
          className="input__form"
          type="date"
          name="dateOfBirth"
          value={dateOfBirth}
          onChange={handleInputChange}
        />
      </div>
        
      <div className="container__form--div">
      <label className="label__title">Hết Hạn:</label>
        <input
          className="input__form"
          type="date"
          name="expirationDate"
          value={expirationDate}
          onChange={handleInputChange}
        />
      </div>
        

        <div className="container__form--div">
        <label className="label__title">Giới Tính:</label>
        <select
          className="input__form"
          name="gender"
          value={gender}
          onChange={handleInputChange}
        >
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </select>
        </div>
      </div>

      <button className="generate__button" onClick={generateCode}>
        Tạo mã MRZ
      </button>

      </div>
      <div className="div__right">
      {generatedCode && (
        <div className="generated-code">
          <b>Mã MRZ</b>
          <pre className="text__result">{generatedCode}</pre>
          <button className="copy-button" onClick={copyToClipboard}>
            {isCopied ? "Đã sao chép" : "Sao chép"}
          </button>
        </div>
      )}
      </div>
      </div>
    </div>
  );
}

export default App;
