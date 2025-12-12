export interface Env {
   PORT:string
   DATABASE_NAME:string,
   DATABASE_PASSWORD:string,
   USER:string,
   JWT_SECRET:string,
   JWT_EXPIRES_IN:string
}
export const env: Env ={
   PORT:Deno.env.get("PORT")!,
   DATABASE_NAME:Deno.env.get("DATABASE_NAME")!,
   DATABASE_PASSWORD:Deno.env.get("DATABASE_PASSWORD")!,
   USER:Deno.env.get("USER")!,
   JWT_SECRET:Deno.env.get("JWT_SECRET")!,
   JWT_EXPIRES_IN:Deno.env.get("JWT_EXPIRES_IN")!
}