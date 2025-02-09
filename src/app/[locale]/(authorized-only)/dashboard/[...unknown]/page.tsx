import { notFound } from "next/navigation";
import { metadata } from "../not-found";

export { metadata };

export default function NotFound() {
  notFound();
}
