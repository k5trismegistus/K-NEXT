import { Chip } from "@mui/material";
import { trpc } from "../api/trpc/trpc-router";

type TagChipProps = {
  label: string;
  taggingId: number;
  afterDelete?: () => void;
};

export default ({ label, taggingId, afterDelete }: TagChipProps) => {
  let { mutateAsync: handleDelete } = trpc.deactivateTag.useMutation({
    onSuccess: (_) => {
      afterDelete ? afterDelete() : null;
    },
  });

  return (
    <Chip
      clickable
      component="a"
      href={`/search?tag=${label}`}
      label={label}
      onDelete={() => handleDelete({ taggingId })}
    />
  );
};
