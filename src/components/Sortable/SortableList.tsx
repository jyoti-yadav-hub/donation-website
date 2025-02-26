import React from "react";
import {
  SortableContainer,
  SortableContainerProps,
  SortableElementProps,
  SortEndHandler,
} from "react-sortable-hoc";
import SortableItem from "./SortableItem";

export type OnSortEndHandler = (parentIndex: number[]) => SortEndHandler;

export interface subItemProps extends Omit<Props, "onSortEnd"> {}

export type SortableItems = {
  title: string;
  key: string | number;
  itemProps?: Omit<SortableElementProps, "index">;
  ques: any;
  inputs?: Omit<subItemProps, "sortEndHandler" | "parentIndex">;
}[];

interface OwnProps extends Omit<SortableContainerProps, "onSortEnd"> {
  items: SortableItems;
  sortEndHandler: OnSortEndHandler;
  parentIndex: number[];
  setFeilds?: any;
  btnDisabled?: any;
  setBtnDisabled?: any;
  isEdit?: any;
}

type Props = OwnProps;

const SortableList: React.FC<Props> = ({
  items,
  sortEndHandler,
  parentIndex,
  setFeilds,
  btnDisabled,
  setBtnDisabled,
  isEdit,
}) => {
  return (
    <ul>
      {items?.map((ques: any, i: any) => {
        return (
          <>
            <SortableItem
              isEdit={isEdit}
              item={ques}
              index={i}
              inputs={ques?.inputs}
              sortEndHandler={sortEndHandler}
              parantIndex={parentIndex}
              currentIndex={i}
              feilds={items}
              setFeilds={setFeilds}
              setBtnDisabled={setBtnDisabled}
              btnDisabled={btnDisabled}
              i={i}
            />
          </>
        );
      })}
    </ul>
  );
};

export default SortableContainer(SortableList);
