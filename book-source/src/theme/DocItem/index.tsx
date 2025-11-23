import DocItem from '@theme-original/DocItem';

// Simple passthrough wrapper - the actual doc context publishing
// is done in DocItem/Content/index.tsx which is inside the DocProvider
export default function DocItemWrapper(props: any) {
  return <DocItem {...props} />;
}


