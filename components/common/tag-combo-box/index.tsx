import { Tag } from "@/lib/db/schema";
import { Autocomplete, Chip, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

function TagComboBox(props: {
  value: Tag[];
  handleChange: (tags: Tag[]) => void;
}) {
  const { value, handleChange } = props;
  const [tagOptions, setTagOptions] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/tag")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched tags:", data);
        setTagOptions(data);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Autocomplete
      multiple
      id="tags-filled"
      loading={loading}
      options={tagOptions.map((tag) => tag.tag)}
      freeSolo
      value={value.map((tag) => tag.tag)}
      onChange={(event, newValue) => {
        const uniqueTags = Array.from(new Set(newValue));
        // Convert strings to Tag objects
        const tagObjects: Tag[] = uniqueTags.map((tag) => {
          const existingTag = tagOptions.find((t) => t.tag === tag);
          return existingTag ? existingTag : ({ id: -1, tag } as Tag); // id: -1 for new tags
        });

        handleChange(tagObjects);
      }}
      renderValue={(value: readonly string[], getItemProps) =>
        value.map((option: string, index: number) => {
          const { key, ...itemProps } = getItemProps({ index });
          return (
            <Chip variant="outlined" label={option} key={key} {...itemProps} />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Topics/Tags"
          placeholder="Add a tag(s)"
          helperText="Provide a list of topics or tags related to this activity either from the list or by typing and pressing Enter"
        />
      )}
    />
  );
}

export default TagComboBox;
