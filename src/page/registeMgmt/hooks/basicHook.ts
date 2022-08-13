export function useBasic({ $vm }) {
  const handleClick = () => {
    console.log($vm.count.value, $vm, '=====');
    $vm.count.value = $vm.count.value + 1;
  };

  return {
    handleClick,
  };
}
