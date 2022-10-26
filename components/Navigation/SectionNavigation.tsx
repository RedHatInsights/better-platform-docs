import Link from "next/link";
import sections from "./sections/sections.json";

const SectionNavigation = () => {
  return (
    <ul>
      {sections.map(({ title, href }) => (
        <li key={href}>
          <Link href={href}>
            <a>{title}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SectionNavigation;
