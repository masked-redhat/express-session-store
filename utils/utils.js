import { v4 as uuidv4 } from "uuid";

export const uniqStr = () => {
  let cTime = Date.now().toString();
  cTime = `${cTime.slice(0, 5)}-${cTime.slice(5, 8)}-${cTime.slice(8)}`;

  return cTime + "-" + uuidv4();
};
