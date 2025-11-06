// global.d.ts
interface Window {
  gapi: any;  // gapi 객체를 any 타입으로 추가
  onGapiLoad: () => void;
}
