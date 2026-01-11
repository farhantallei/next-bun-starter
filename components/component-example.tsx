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
import { getPaginatedData } from "@/features/examples/api"
import type { ItemExample } from "@/features/examples/types"
import type { PanigatedResponse } from "@/types/response"

import { InfiniteCombobox } from "./ui/infinite-combobox"

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
                console.log(key, value || "empty")
              }
            }}
          >
            <Field name="test">
              <FieldLabel>Test</FieldLabel>
              <InfiniteCombobox<ItemExample, PanigatedResponse<ItemExample>>
                ariaLabel="Search items"
                getItems={(response) => response.data}
                getNextPageParam={(lastPage) =>
                  lastPage.pagination.hasNextPage
                    ? lastPage.pagination.page + 1
                    : undefined
                }
                itemToStringLabel={(item) => item.title}
                itemToStringValue={(item) => `${item.id}`}
                placeholder="Search items..."
                queryFn={({ page, search }) =>
                  getPaginatedData({ page, limit: 30, search })
                }
                queryKey={["data-select"]}
                required
                useTrigger
              />
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
