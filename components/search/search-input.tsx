import React, { useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Bullseye,
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  MenuProps,
  Popper,
  SearchInput,
  SearchInputProps,
  Spinner,
  Text,
  TextContent,
  Title,
  debounce,
} from "@patternfly/react-core";
import Link from "next/link";
import { createUseStyles } from "react-jss";
import { useRouter } from "next/router";
import classNames from "classnames";
import clsx from "clsx";

const useStyles = createUseStyles({
  searchResultTitle: {},
  ellipsis: {
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  fragment: {
    color: "var(--pf-global--palette--blue-200)",
  },
  fragmentMatch: {
    textDecoration: "underline",
    color: "var(--pf-global--link--Color)",
  },
  textInputGroup: {
    "--pf-c-text-input-group--BackgroundColor":
      "var(--pf-global--palette--black-700) !important",
    "--pf-c-text-input-group__icon--Color":
      "var(--pf-global--primary-color--light-100)",
    "--pf-c-text-input-group__text--after--BorderBottomColor":
      "var(--pf-global--palette--black-500)",
    "--pf-c-text-input-group__text--before--BorderColor":
      "var(--pf-global--palette--black-800)",
    "--pf-c-text-input-group__text--hover__icon--Color":
      "var(--pf-global--primary-color--light-100)",
    "& input::placeholder": {
      color: "var(--pf-global--Color--light-300)",
    },
    "& input, input:hover::placeholder": {
      color: "var(--pf-global--Color--light-100) !important",
    },
    "&:hover": {
      "--pf-c-text-input-group__text--after--BorderBottomColor":
        "var(--pf-global--active-color--300)",
    },
    "& input:focus-visible": {
      outline:
        "var(--pf-global--BorderWidth--sm) solid var(--pf-global--BackgroundColor--dark-100)",
    },
  },
});

type ApiPayload = {
  url: string;
  term: string;
  value: string;
};
type SearchResult = ApiPayload & {
  tagName: string;
};

const fetchSearchResults = async (
  term: string
): Promise<{ [tagName: string]: ApiPayload[] }> => {
  const { data } = await fetch(`/platform-docs/search?term=${term}`).then((r) =>
    r.json()
  );
  return data;
};

const adjustResultURL = (url: string) => {
  const resultUrl = new URL(url);
  return `${document.location.origin}${resultUrl.pathname}${resultUrl.search}${resultUrl.hash}`;
};

const processResults = (searchResults: { [tagName: string]: ApiPayload[] }) =>
  Object.entries(searchResults)
    .reduce<SearchResult[]>(
      (acc, [tagName, meta]) => [
        ...acc,
        ...meta.map((meta) => ({ ...meta, tagName })),
      ],
      []
    )
    .slice(0, 10);

const processLinkOption = (
  term: string,
  content: string,
  classes: {
    fragment: string;
    fragmentMatch: string;
  }
) => {
  const termMatchPos = content.toLowerCase().match(term.toLowerCase())?.[
    "index"
  ];
  if (typeof termMatchPos === "undefined" || isNaN(termMatchPos)) {
    return content;
  }
  const termLen = term.length;
  let contentArr = [...content].map((char, index) => (
    <span
      key={index}
      className={classNames(classes.fragment, {
        [classes.fragmentMatch]:
          index >= termMatchPos && index < termMatchPos + termLen,
      })}
    >
      {char}
    </span>
  ));
  if (termMatchPos > 15) {
    contentArr = [
      <span key="pre-1">.</span>,
      <span key="pre-2">.</span>,
      <span key="pre-3">.</span>,
      ...contentArr.slice(10),
    ];
  }
  return contentArr;
};

const LoadingItem = (
  <MenuItem key="loading">
    <Bullseye>
      <Spinner className="pf-u-m-xl" size="xl" />
    </Bullseye>
  </MenuItem>
);

const DocSearch = ({ className }: { className?: string }) => {
  const classes = useStyles();
  const [value, setValue] = useState<string | number>("");
  const [autocompleteOptions, setAutocompleteOptions] = useState<JSX.Element[]>(
    []
  );
  const router = useRouter();
  const resultCache = useRef<{ [key: string]: SearchResult[] }>({});

  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef(null);

  const searchCache = (query: string) => {
    return resultCache.current[query];
  };

  const updateCache = (query: string, result: SearchResult[]) => {
    resultCache.current[query] = result;
  };

  const onClear: SearchInputProps["onClear"] = (e) => {
    e.preventDefault();
    setValue("");
    setIsAutocompleteOpen(false);
  };

  const populateSearchMenu = async (term: string) => {
    let trimmedData = searchCache(term);

    if (!trimmedData) {
      try {
        const searchResults = await fetchSearchResults(term);
        trimmedData = processResults(searchResults);
        updateCache(term, trimmedData);
      } catch (error) {
        trimmedData = [];
        console.error(error);
      }
    }

    if (trimmedData.length === 0) {
      setAutocompleteOptions([
        <MenuItem key="empty">
          <Bullseye>
            <TextContent className="pf-u-m-xl">
              <Text>
                We looked everywhere but found nothing. Try something different.
              </Text>
            </TextContent>
          </Bullseye>
        </MenuItem>,
      ]);
      return;
    }

    let options = trimmedData.map((option, index) => {
      const adjustedUrl = adjustResultURL(option.url);
      return (
        <MenuItem
          onClick={() => router.push(adjustedUrl)}
          itemId={option.value}
          key={index}
        >
          <Link href={adjustedUrl}>
            <a>
              <Title className={classes.ellipsis} headingLevel="h2" size="md">
                {processLinkOption(term, option.value, classes)}
              </Title>
              <TextContent>
                <Text className={classes.ellipsis} component="small">
                  {adjustResultURL(adjustedUrl)}
                </Text>
              </TextContent>
            </a>
          </Link>
        </MenuItem>
      );
    });
    setAutocompleteOptions(options);
  };

  const debouncedPopulateSearchMenu = useCallback(
    debounce(populateSearchMenu, 500),
    []
  );
  const onChange = async (newValue: string) => {
    if (
      newValue !== "" &&
      searchInputRef &&
      searchInputRef.current &&
      searchInputRef.current.contains(document.activeElement)
    ) {
      setValue(newValue);
      setIsAutocompleteOpen(true);
      if (autocompleteOptions.length === 0) {
        setAutocompleteOptions([LoadingItem]);
      }
      debouncedPopulateSearchMenu(newValue);
    } else {
      setIsAutocompleteOpen(false);
    }
  };

  const onSelect: MenuProps["onSelect"] = (e, itemId) => {
    e?.stopPropagation();
    if (itemId) {
      setValue(itemId);
    }
    setIsAutocompleteOpen(false);
    searchInputRef.current?.focus();
  };

  const searchInput = (
    <SearchInput
      placeholder="Search for docs"
      className={clsx(classes.textInputGroup, "pf-u-flex-grow-1")}
      value={value.toString()}
      onChange={onChange}
      onClear={onClear}
      ref={searchInputRef}
      id="autocomplete-search"
    />
  );

  const autocomplete = (
    <Menu ref={autocompleteRef} onSelect={onSelect}>
      <MenuContent>
        <MenuList>{autocompleteOptions}</MenuList>
      </MenuContent>
    </Menu>
  );
  return (
    <Popper
      trigger={searchInput}
      popper={autocomplete}
      isVisible={isAutocompleteOpen}
      enableFlip={false}
      // append the autocomplete menu to the search input in the DOM for the sake of the keyboard navigation experience
      appendTo={() => document.querySelector("#autocomplete-search")!}
    />
  );
};

DocSearch.propTypes = {
  className: PropTypes.string,
};

export default DocSearch;
