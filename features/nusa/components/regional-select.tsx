"use client"

import { useEffect, useState } from "react"

import { AsyncCombobox } from "@/components/ui/async-combobox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { InputDisplay } from "@/components/ui/input-display"

import {
  getNusaDistricts,
  getNusaProvinces,
  getNusaRegencies,
  getNusaVillages,
} from "../api"
import type {
  NusaDistrictModel,
  NusaProvinceModel,
  NusaRegencyModel,
  NusaVillageModel,
} from "../types"

export interface RegionalSelectValue {
  province: NusaProvinceModel | null
  regency: NusaRegencyModel | null
  district: NusaDistrictModel | null
  village: NusaVillageModel | null
}

interface RegionalSelectProps {
  value?: RegionalSelectValue
  onValueChange?: (value: RegionalSelectValue) => void
  required?: boolean
  disabled?: boolean
  showLabels?: boolean
}

const defaultValue: RegionalSelectValue = {
  province: null,
  regency: null,
  district: null,
  village: null,
}

export function RegionalSelect({
  value,
  onValueChange,
  required = false,
  disabled = false,
  showLabels = true,
}: RegionalSelectProps) {
  const [internalValue, setInternalValue] =
    useState<RegionalSelectValue>(defaultValue)

  const currentValue = value ?? internalValue

  const updateValue = (newValue: RegionalSelectValue) => {
    if (!value) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  // Sync internal state when controlled value changes
  useEffect(() => {
    if (value) {
      setInternalValue(value)
    }
  }, [value])

  const { province, regency, district, village } = currentValue

  return (
    <>
      <Field name="province">
        {showLabels ? <FieldLabel>Provinsi</FieldLabel> : null}
        <AsyncCombobox<NusaProvinceModel>
          ariaLabel="Search provinsi"
          disabled={disabled}
          itemToStringLabel={(item) => item.name}
          itemToStringValue={(item) => item.code}
          onValueChange={(val) => {
            updateValue({
              province: val,
              regency: null,
              district: null,
              village: null,
            })
          }}
          placeholder="Search provinsi..."
          queryFn={getNusaProvinces}
          queryKey={["nusa-provinces"]}
          required={required}
          triggerPlaceholder="Select provinsi"
          useTrigger
          value={province}
        />
        <FieldError />
      </Field>

      <Field name="regency">
        {showLabels ? <FieldLabel>Kabupaten/Kota</FieldLabel> : null}
        {province ? (
          <AsyncCombobox<NusaRegencyModel>
            ariaLabel="Search kabupaten/kota"
            disabled={disabled}
            itemToStringLabel={(item) => item.name}
            itemToStringValue={(item) => item.code}
            onValueChange={(val) => {
              updateValue({
                ...currentValue,
                regency: val,
                district: null,
                village: null,
              })
            }}
            placeholder="Search kabupaten/kota..."
            queryFn={() =>
              getNusaRegencies(province.code).then((r) => r.regencies)
            }
            queryKey={["nusa-regencies", province.code]}
            required={required}
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
        {showLabels ? <FieldLabel>Kecamatan</FieldLabel> : null}
        {regency ? (
          <AsyncCombobox<NusaDistrictModel>
            ariaLabel="Search kecamatan"
            disabled={disabled}
            itemToStringLabel={(item) => item.name}
            itemToStringValue={(item) => item.code}
            onValueChange={(val) => {
              updateValue({
                ...currentValue,
                district: val,
                village: null,
              })
            }}
            placeholder="Search kecamatan..."
            queryFn={() =>
              getNusaDistricts(regency.code).then((r) => r.districts)
            }
            queryKey={["nusa-districts", regency.code]}
            required={required}
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
        {showLabels ? <FieldLabel>Kelurahan</FieldLabel> : null}
        {district ? (
          <AsyncCombobox<NusaVillageModel>
            ariaLabel="Search kelurahan"
            disabled={disabled}
            itemToStringLabel={(item) => item.name}
            itemToStringValue={(item) => item.code}
            onValueChange={(val) => {
              updateValue({
                ...currentValue,
                village: val,
              })
            }}
            placeholder="Search kelurahan..."
            queryFn={() =>
              getNusaVillages(district.code).then((r) => r.villages)
            }
            queryKey={["nusa-villages", district.code]}
            required={required}
            triggerPlaceholder="Select kelurahan"
            useTrigger
            value={village}
          />
        ) : (
          <InputDisplay>Select kecamatan first</InputDisplay>
        )}
        <FieldError />
      </Field>
    </>
  )
}
