"use client"

import { useState } from "react"

import { RichEditor, SimpleEditor } from "@/components/editor"
import { Example, ExampleWrapper } from "@/components/example"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { submitEditorAction } from "@/features/editor/actions"

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
    <Example containerClassName="col-span-2" title="Form">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Please fill in your details below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            errors={errors}
            onSubmit={async (e) => {
              e.preventDefault()

              const formData = new FormData(e.currentTarget)

              const result = await submitEditorAction(formData)

              if (result.error) {
                if (typeof result.error === "string") {
                  console.debug(result.error)
                } else {
                  setErrors(result.error.fieldErrors)
                }
                return
              }

              window.alert(JSON.stringify(result.data, null, 2))
            }}
          >
            <Field name="simpleEditor">
              <FieldLabel>Simple Editor</FieldLabel>
              <SimpleEditor
                name="simpleEditor"
                placeholder="Write with basic formatting..."
              />
              <FieldError />
            </Field>
            <Field name="richEditor">
              <FieldLabel>Rich Editor</FieldLabel>
              <RichEditor
                name="richEditor"
                placeholder="Write with rich formatting..."
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
