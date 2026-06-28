import {useId, useMemo} from "react";

import {ChevronDown} from "lucide-react";
import Select, {
  type ClassNamesConfig,
  type DropdownIndicatorProps,
  type GroupBase,
  components,
} from "react-select";

import {cn} from "@/lib/cn";

import {strings} from "../../strings";
import {PROFILE_CREATION_LANGUAGE_OPTIONS} from "../profileCreationModel";
import {profileCreationSectionDividerClass} from "../sectionDivider";

export {profileCreationSectionDividerClass};

const pc = strings.profile.profileCreation;

type SelectOption = {label: string; value: string};

export const profileCreationFieldInputClass =
  "mt-app-1 w-full rounded-xl border border-unora-line/90 bg-white/90 px-app-3 py-2.5 text-sm text-unora-ink shadow-none outline-none transition placeholder:text-unora-mist/70 focus:border-unora-brand-strong/40 focus:ring-2 focus:ring-unora-brand/20";

function ProfileCreationDropdownIndicator(
  props: DropdownIndicatorProps<SelectOption, boolean, GroupBase<SelectOption>>
) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 shrink-0 text-unora-mist" aria-hidden />
    </components.DropdownIndicator>
  );
}

const profileCreationSelectClassNames: ClassNamesConfig<
  SelectOption,
  false,
  GroupBase<SelectOption>
> = {
  control: ({isFocused, isDisabled}) =>
    cn(
      "tap-highlight-none flex min-h-[2.75rem] w-full cursor-default flex-wrap items-center justify-between rounded-xl border border-unora-line/90 bg-white/90 px-app-2 text-sm text-unora-ink shadow-none outline-none transition",
      isFocused &&
        "border-unora-brand-strong/40 ring-2 ring-unora-brand/20 ring-offset-0",
      isDisabled && "cursor-not-allowed opacity-60"
    ),
  valueContainer: () => "flex flex-1 flex-wrap items-center gap-1 py-1 pl-1",
  singleValue: () => "text-unora-ink",
  placeholder: () => "text-unora-mist/70",
  input: () => "m-0 p-0 text-unora-ink",
  indicatorsContainer: () => "flex shrink-0 items-center gap-0.5 pr-1",
  menu: () =>
    "z-50 mt-1 overflow-hidden rounded-xl border border-unora-line/90 bg-white/95 py-1 text-sm shadow-lg ring-1 ring-black/5",
  menuList: () => "max-h-[280px] overflow-y-auto py-0",
  option: ({isFocused, isSelected}) =>
    cn(
      "cursor-pointer px-app-3 py-2.5 tap-highlight-none",
      isSelected && "bg-unora-blush/70 font-medium text-unora-ink",
      isFocused && !isSelected && "bg-unora-cloud/80 text-unora-ink"
    ),
  noOptionsMessage: () => "px-app-3 py-2 text-unora-mist",
  /** Portal wrapper: above bottom nav (`z-50`), below full-screen pickers (e.g. `z-[80]`). */
  menuPortal: () => "z-[70]",
};

const profileCreationMultiSelectClassNames = {
  ...profileCreationSelectClassNames,
  multiValue: () =>
    "inline-flex items-center rounded-lg bg-unora-cloud/85 px-1.5 py-0.5 text-xs font-medium text-unora-ink",
  multiValueLabel: () => "px-0.5",
  multiValueRemove: () =>
    "ml-0.5 rounded px-0.5 hover:bg-unora-line/70 hover:text-unora-ink",
} as ClassNamesConfig<SelectOption, true, GroupBase<SelectOption>>;

const languageSelectOptions: SelectOption[] =
  PROFILE_CREATION_LANGUAGE_OPTIONS.map((o) => ({
    label: o.label,
    value: o.value,
  }));

function parseLanguagesDraftToOptions(stored: string): SelectOption[] {
  if (!stored.trim()) {
    return [];
  }
  const seen = new Set<string>();
  const out: SelectOption[] = [];
  for (const raw of stored.split(",")) {
    const seg = raw.trim();
    if (!seg) {
      continue;
    }
    const hit =
      languageSelectOptions.find((o) => o.label === seg) ??
      languageSelectOptions.find(
        (o) => o.label.toLowerCase() === seg.toLowerCase()
      );
    if (hit && !seen.has(hit.value)) {
      seen.add(hit.value);
      out.push(hit);
      if (out.length >= 3) {
        break;
      }
    }
  }
  return out;
}

export function ProfileCreationLanguagesField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const reactId = useId();
  const inputId = `profile-creation-lang-${reactId}`;
  const labelId = `profile-creation-lang-label-${reactId}`;

  const selected = useMemo(() => parseLanguagesDraftToOptions(value), [value]);

  return (
    <label className="block" htmlFor={inputId}>
      <span
        id={labelId}
        className="text-xs font-medium uppercase tracking-wide text-unora-mist">
        {label}
      </span>
      <div className="mt-app-1">
        <Select<SelectOption, true, GroupBase<SelectOption>>
          inputId={inputId}
          instanceId={inputId}
          aria-labelledby={labelId}
          unstyled
          isMulti
          isClearable
          isSearchable
          classNames={profileCreationMultiSelectClassNames}
          components={{
            DropdownIndicator: ProfileCreationDropdownIndicator,
            IndicatorSeparator: () => null,
          }}
          options={languageSelectOptions}
          value={selected}
          isOptionDisabled={(opt) =>
            selected.length >= 3 && !selected.some((s) => s.value === opt.value)
          }
          onChange={(opts) => {
            const next = (opts ?? []) as SelectOption[];
            onChange(
              next
                .slice(0, 3)
                .map((o) => o.label)
                .join(", ")
            );
          }}
          placeholder={pc.fields.languagesMultiPlaceholder}
          blurInputOnSelect={false}
          closeMenuOnSelect={false}
          menuPlacement="auto"
          menuPosition="fixed"
          menuPortalTarget={
            typeof globalThis.document !== "undefined"
              ? globalThis.document.body
              : null
          }
        />
      </div>
    </label>
  );
}

export type ProfileCreationFieldPublicToggle = {
  checked: boolean;
  helperText: string;
  onChange: (checked: boolean) => void;
};

export function ProfileCreationSelectField({
  label,
  value,
  labelClassName,
  onChange,
  optionKeys,
  labels,
  publicToggle,
}: {
  label: string;
  labels: Record<string, string>;
  optionKeys: readonly string[];
  value: string;
  labelClassName?: string;
  onChange: (v: string) => void;
  publicToggle?: ProfileCreationFieldPublicToggle;
}) {
  const reactId = useId();
  const inputId = `profile-creation-select-${reactId}`;
  const labelId = `profile-creation-select-label-${reactId}`;

  const options = useMemo<SelectOption[]>(
    () =>
      optionKeys.map((k) => ({
        value: k,
        label: labels[k] ?? k,
      })),
    [optionKeys, labels]
  );

  const selected = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value]
  );

  const labelEl = (
    <span
      id={labelId}
      className={cn(
        "text-xs font-medium uppercase tracking-wide text-unora-mist",
        labelClassName
      )}>
      {label}
    </span>
  );

  const publicCheckboxRow = publicToggle ? (
    <label className="mt-app-2 flex cursor-pointer items-center justify-start gap-1.5 self-start text-left tap-highlight-none">
      <input
        checked={publicToggle.checked}
        className="h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-2 border-unora-ink/50 accent-unora-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-unora-brand/30"
        type="checkbox"
        onChange={(e) => publicToggle.onChange(e.target.checked)}
      />
      <span className="text-[11px] font-medium leading-tight text-unora-ink/65">
        {publicToggle.helperText}
      </span>
    </label>
  ) : null;

  const selectEl = (
    <Select<SelectOption, false, GroupBase<SelectOption>>
      inputId={inputId}
      instanceId={inputId}
      aria-labelledby={labelId}
      unstyled
      classNames={profileCreationSelectClassNames}
      components={{
        DropdownIndicator: ProfileCreationDropdownIndicator,
        IndicatorSeparator: () => null,
      }}
      options={options}
      value={selected}
      onChange={(opt) => {
        onChange(opt?.value ?? "");
      }}
      placeholder={pc.selectChoose}
      isSearchable={false}
      blurInputOnSelect
      menuPlacement="auto"
      menuPosition="fixed"
      menuPortalTarget={
        typeof globalThis.document !== "undefined"
          ? globalThis.document.body
          : null
      }
    />
  );

  if (publicToggle) {
    return (
      <div className="block">
        {labelEl}
        <div className="mt-app-1">{selectEl}</div>
        {publicCheckboxRow}
      </div>
    );
  }

  return (
    <label className="block" htmlFor={inputId}>
      {labelEl}
      <div className="mt-app-1">{selectEl}</div>
    </label>
  );
}

export function ProfileCreationTextField({
  label,
  value,
  onChange,
  onBlurCommitValue,
  placeholder,
  publicToggle,
  digitsOnly,
  maxLength,
}: {
  label: string;
  placeholder: string;
  value: string;
  /** When set, strips all non-digit characters (e.g. height in cm). */
  digitsOnly?: boolean;
  maxLength?: number;
  /** Called on blur with the input’s current value (avoids stale controlled state vs last keystroke). */
  onBlurCommitValue?: (value: string) => void;
  onChange: (v: string) => void;
  publicToggle?: ProfileCreationFieldPublicToggle;
}) {
  const labelTextId = useId();
  const normalize = (raw: string) =>
    digitsOnly ? raw.replaceAll(/\D/g, "") : raw;

  const inputEl = (
    <input
      aria-labelledby={labelTextId}
      type="text"
      inputMode={digitsOnly ? "numeric" : undefined}
      pattern={digitsOnly ? "[0-9]*" : undefined}
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      onBlur={
        onBlurCommitValue
          ? (e) => onBlurCommitValue(normalize(e.currentTarget.value))
          : undefined
      }
      onChange={(e) => {
        onChange(normalize(e.target.value));
      }}
      className={profileCreationFieldInputClass}
    />
  );

  if (publicToggle) {
    return (
      <div className="block">
        <span
          className="mb-app-1 block text-xs font-medium uppercase tracking-wide text-unora-mist"
          id={labelTextId}>
          {label}
        </span>
        {inputEl}
        <label className="mt-app-2 flex cursor-pointer items-center justify-start gap-1.5 self-start text-left tap-highlight-none">
          <input
            checked={publicToggle.checked}
            className="h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-2 border-unora-ink/50 accent-unora-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-unora-brand/30"
            type="checkbox"
            onChange={(e) => publicToggle.onChange(e.target.checked)}
          />
          <span className="text-[11px] font-medium leading-tight text-unora-ink/65">
            {publicToggle.helperText}
          </span>
        </label>
      </div>
    );
  }

  return (
    <label className="block">
      <span
        className="text-xs font-medium uppercase tracking-wide text-unora-mist"
        id={labelTextId}>
        {label}
      </span>
      {inputEl}
    </label>
  );
}
