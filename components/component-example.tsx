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
import { Textarea } from "@/components/ui/textarea"

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
    <Example containerClassName="col-span-2" title="Form">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Please fill in your details below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form>
            <Field>
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
            <Field>
              <FieldLabel htmlFor="small-form-comments">Comments</FieldLabel>
              <Textarea
                id="small-form-comments"
                placeholder="Add any additional comments"
              />
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
