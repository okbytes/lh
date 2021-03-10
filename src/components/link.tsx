import type { LinkProps } from "next/link"
import NextLink from "next/link"
import { isString } from "utils/guards"

const Link = ({ href, ...rest }: React.PropsWithChildren<LinkProps>) => {
  // this is an external link
  if (isString(href) && href?.startsWith("http")) {
    return <a target="_blank" rel="noopener noreferrer" href={href} {...rest} />
  }
  // this is an internal link
  return (
    <NextLink href={href} passHref>
      <a {...rest} />
    </NextLink>
  )
}

export default Link
