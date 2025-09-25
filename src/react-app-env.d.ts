/// <reference types="react-scripts" />

// Типы для CSS модулей
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
