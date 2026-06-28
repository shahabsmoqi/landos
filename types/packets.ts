export type PacketId =
  | "predevelopment-meeting"
  | "rezoning-inquiry"
  | "utility-availability"
  | "preliminary-plat"
  | "floodplain-review"
  | "investor-feasibility";

export interface PacketDocument {
  name: string;
  available: boolean;
  note?: string;
}

export interface SubmissionPacket {
  id: PacketId;
  title: string;
  shortTitle: string;
  purpose: string;
  recipient: string;
  recipientRole: string;
  requiredDocuments: PacketDocument[];
  prepTimeEstimate: string;
  draftText: string;
  category: "government" | "utility" | "investor";
}
