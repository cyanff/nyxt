// Allow importing CSS as a string.
declare module "*.css" {
  const content: string;
  export default content;
}
