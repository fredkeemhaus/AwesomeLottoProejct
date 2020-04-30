import axios from "axios";

const api = axios.create({
  baseURL: `https://www.nlotto.co.kr`
});

export const item = {
  getDrw: drwNumber =>
    api.get(`/common.do?method=getLottoNumber&drwNo=${drwNumber}`)
};
