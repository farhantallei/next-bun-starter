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
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import {
  getNusaDistricts,
  getNusaProvinces,
  getNusaRegencies,
  getNusaVillages,
} from "@/features/nusa/api"
import type {
  NusaDistrictModel,
  NusaProvinceModel,
  NusaRegencyModel,
  NusaVillageModel,
} from "@/features/nusa/types"

import { AsyncCombobox } from "./ui/async-combobox"
import { InputDisplay } from "./ui/input-display"

export function ComponentExample() {
  return (
    <ExampleWrapper>
      <FormExample />
    </ExampleWrapper>
  )
}

function FormExample() {
  const [province, setProvince] = useState<NusaProvinceModel | null>(null)
  const [regency, setRegency] = useState<NusaRegencyModel | null>(null)
  const [district, setDistrict] = useState<NusaDistrictModel | null>(null)
  const [village, setVillage] = useState<NusaVillageModel | null>(null)

  return (
    <Example containerClassName="col-span-2 lg:max-w-md" title="Form">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>Enter your complete address</CardDescription>
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
            <Field name="province">
              <FieldLabel>Provinsi</FieldLabel>
              <AsyncCombobox<NusaProvinceModel>
                ariaLabel="Search provinsi"
                itemToStringLabel={(item) => item.name}
                itemToStringValue={(item) => item.code}
                onValueChange={(val) => {
                  setProvince(val)
                  setRegency(null)
                  setDistrict(null)
                  setVillage(null)
                }}
                placeholder="Search provinsi..."
                queryFn={getNusaProvinces}
                queryKey={["nusa-provinces"]}
                required
                triggerPlaceholder="Select provinsi"
                useTrigger
                value={province}
              />
              <FieldError />
            </Field>

            <Field name="regency">
              <FieldLabel>Kabupaten/Kota</FieldLabel>
              {province ? (
                <AsyncCombobox<NusaRegencyModel>
                  ariaLabel="Search kabupaten/kota"
                  itemToStringLabel={(item) => item.name}
                  itemToStringValue={(item) => item.code}
                  onValueChange={(val) => {
                    setRegency(val)
                    setDistrict(null)
                    setVillage(null)
                  }}
                  placeholder="Search kabupaten/kota..."
                  queryFn={() =>
                    getNusaRegencies(province.code).then((r) => r.regencies)
                  }
                  queryKey={["nusa-regencies", province.code]}
                  required
                  triggerPlaceholder="Select kabupaten/kota"
                  useTrigger
                  value={regency}
                />
              ) : (
                <InputDisplay>Select provinsi first</InputDisplay>
              )}
              <FieldError />
            </Field>

            <Field name="district">
              <FieldLabel>Kecamatan</FieldLabel>
              {regency ? (
                <AsyncCombobox<NusaDistrictModel>
                  ariaLabel="Search kecamatan"
                  itemToStringLabel={(item) => item.name}
                  itemToStringValue={(item) => item.code}
                  onValueChange={(val) => {
                    setDistrict(val)
                    setVillage(null)
                  }}
                  placeholder="Search kecamatan..."
                  queryFn={() =>
                    getNusaDistricts(regency.code).then((r) => r.districts)
                  }
                  queryKey={["nusa-districts", regency.code]}
                  required
                  triggerPlaceholder="Select kecamatan"
                  useTrigger
                  value={district}
                />
              ) : (
                <InputDisplay>Select kabupaten/kota first</InputDisplay>
              )}
              <FieldError />
            </Field>

            <Field name="village">
              <FieldLabel>Kelurahan</FieldLabel>
              {district ? (
                <AsyncCombobox<NusaVillageModel>
                  ariaLabel="Search kelurahan"
                  itemToStringLabel={(item) => item.name}
                  itemToStringValue={(item) => item.code}
                  onValueChange={setVillage}
                  placeholder="Search kelurahan..."
                  queryFn={() =>
                    getNusaVillages(district.code).then((r) => r.villages)
                  }
                  queryKey={["nusa-villages", district.code]}
                  required
                  triggerPlaceholder="Select kelurahan"
                  useTrigger
                  value={village}
                />
              ) : (
                <InputDisplay>Select kecamatan first</InputDisplay>
              )}
              <FieldError />
            </Field>

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
