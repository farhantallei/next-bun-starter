"use client"

import { Example, ExampleWrapper } from "@/components/example"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from "@/components/ui/combobox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import DataSelect from "./data-select"

export function ComponentExample() {
  return (
    <ExampleWrapper>
      <FormExample />
    </ExampleWrapper>
  )
}

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

function FormExample() {
  return (
    <Example containerClassName="col-span-2 lg:max-w-md" title="Form">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Please fill in your details below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            action={(formData) => {
              console.log("submitted")
              for (const [key, value] of formData.entries()) {
                console.log(key, value)
              }
            }}
          >
            <Field name="test">
              <FieldLabel>Test</FieldLabel>
              <DataSelect />
              <FieldError />
            </Field>

            <Field name="framework">
              <FieldLabel htmlFor="small-form-framework">Framework</FieldLabel>
              <Combobox items={frameworks}>
                <ComboboxInput
                  id="small-form-framework"
                  placeholder="Select a framework"
                  required
                />
                <ComboboxPopup>
                  <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxPopup>
              </Combobox>
              <FieldError />
            </Field>
            <div className="flex justify-end gap-2">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </Example>
  )
}
