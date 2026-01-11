"use client"

import { useState } from "react"

import { Example, ExampleWrapper } from "@/components/example"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { submitAddressAction } from "@/features/nusa/actions"
import { RegionalSelect } from "@/features/nusa/components/regional-select"

export function ComponentExample() {
  return (
    <ExampleWrapper>
      <FormExample />
    </ExampleWrapper>
  )
}

function FormExample() {
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  return (
    <Example containerClassName="col-span-2 lg:max-w-md" title="Form">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>Enter your complete address</CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            errors={errors}
            onSubmit={async (e) => {
              e.preventDefault()

              const formData = new FormData(e.currentTarget)

              const result = await submitAddressAction(formData)

              if (result.error) {
                if (typeof result.error === "string") {
                  console.debug(result.error)
                } else {
                  setErrors(result.error.fieldErrors)
                }
              }

              window.alert(JSON.stringify(result.data, null, 2))
            }}
          >
            <RegionalSelect />

            <div className="flex justify-end gap-2">
              <Button type="submit">Save</Button>
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
