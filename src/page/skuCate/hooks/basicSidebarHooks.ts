export function useBasicSidebar({ $vm }) {
  const basicSidebarState = reactive<{
    treeData: any[];
    isLeaveNode: boolean;
    currentNode: Recordable;
  }>({
    currentNode: {},
    isLeaveNode: false,
    treeData: [],
  });

  const getTreeData = () => {
    basicSidebarState.treeData = [
      {
        id: '1',
        name: '经营范围',
        children: [
          {
            id: '2',
            name: '电子产品',
            children: [
              {
                id: '3',
                name: '手机',
              },
              {
                id: '4',
                name: '电脑',
              },
            ],
          },
          {
            id: '5',
            name: '配件',
          },
        ],
      },
    ];
  };

  const handleSelectTreeNode = (data) => {
    $vm.basicFormConfig.model = {
      id: data.id,
      isLeave: !data.hasChildren && data.id !== '1',
      parentId: data.id,
    };
    $vm.initBasicTable();
  };

  return {
    basicSidebarState,
    handleSelectTreeNode,
    getTreeData,
  };
}
