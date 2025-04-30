import { metadata } from "../not-found";
import { notFound } from "next/navigation";

export { metadata };

export default function NotFound() {
  notFound();
}
