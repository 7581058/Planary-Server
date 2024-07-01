import cors from "cors";

// 특정 주소에서 cors 옵션 허용
const whiteList = ["http://localhost:5173"];

const corsOptions = {
  origin: whiteList,
  credential: true,
  optionsSuccesstatus: 200,
};

export default corsOptions;
