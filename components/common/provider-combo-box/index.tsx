import { Provider } from "@/lib/db/schema";
import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

function ProviderComboBox(props: {
  value?: Provider | null;
  handleChange: (provider: Provider) => void;
}) {
  const { value, handleChange } = props;
  const [providerOptions, setProviderOptions] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    fetch("/api/provider")
      .then((response) => response.json())
      .then((data) => {
        setProviderOptions(data);
      })
      .catch((error) => {
        console.error("Error fetching providers:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Autocomplete
      multiple={false}
      id="tags-filled"
      loading={loading}
      options={providerOptions.map((provider) => provider.name)}
      // freeSolo
      value={value?.name}
      onChange={(event, newValue) => {
        const selectedProvider = providerOptions.find(
          (provider) => provider.name === newValue
        );
        if (selectedProvider) {
          handleChange(selectedProvider);
        } else {
          // If the provider is not found in options, create a new one
          const newProvider: Provider = {
            id: 0, // Placeholder, actual ID should be set by the backend
            name: newValue || "",
            contactName: null,
            providerType: null,
            address: null,
            state: null,
            contactEmail: null,
            contactNumber: null,
            userId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          handleChange(newProvider);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Activity Provider/Practice"
          placeholder="Add a provider/practice(s)"
          helperText="Provide a list of providers or practices related to this activity either from the list or by typing and pressing Enter"
        />
      )}
    />
  );
}

export default ProviderComboBox;
