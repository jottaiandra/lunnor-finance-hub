
import { useToast } from "@/hooks/use-toast";
import { toast as hooksToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "./sonner";

// Export both toast systems
export { useToast, hooksToast, sonnerToast as toast };
