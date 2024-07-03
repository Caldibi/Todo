
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Container, EditDeleteContainer, InputContainer, List, ListBox, ListContainer, ModalContainer, ModalBackground,TextField } from "./Style.tsx";
import { nanoid } from "nanoid";
import { FaTrash, FaEdit } from "react-icons/fa";


interface Quote {
  id: string;
  content: string;
}

function App() {

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [addNewItem, setAddNewItem] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [inputEdit, setInputEdit] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const itemContent = [...quotes];
    const [removedItem] = itemContent.splice(result.source.index, 1);
    itemContent.splice(result.destination.index, 0, removedItem);
    setQuotes(itemContent);
  }

  const addItem = () => {
    if (!addNewItem.trim()) return;
    const ItemId = nanoid();
    const newList = {
      id: ItemId,
      content: addNewItem,
    };
    setQuotes([...quotes, newList]);
    setAddNewItem("");
  };

  const deleteItem = (id: string) => {
    setQuotes((quotes)=>{
      return quotes.filter((item)=> item.id !== id)
    });
  };

  const OpenEditModal = (id : string, content : string) => {
    setOpen(true);
    setInputEdit(content);
    setSelectedId(id);

  };

  const saveEditItem = () => {
    const selectedItem = quotes.find((quotes)=> quotes.id === selectedId)
    if(selectedItem){
      selectedItem.content = inputEdit;
      setQuotes([...quotes]);
    }
    setOpen(false);
  };

  const closeModal = () => setOpen(false);

  return (
    <>
      <Container>
        <InputContainer>
          <TextField
            type='text'
            value={addNewItem}
            onChange={(e) => { setAddNewItem(e.target.value) }}
            placeholder="Lütfen Listeye Ekleme Yapın..."
          />
          <Button onClick={addItem}>Ekle</Button>
        </InputContainer>
        <ListContainer>
          <List>
            <h2>Mevcut Liste</h2>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="list">
                {(provider) => (
                  <div ref={provider.innerRef} {...provider.droppableProps} >
                    {quotes.map(({ id, content }: Quote, index) => (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provider) => (
                          <ListBox
                            ref={provider.innerRef}
                            {...provider.draggableProps}
                            {...provider.dragHandleProps}
                          >
                            {content}
                            <EditDeleteContainer>
                              <Button onClick={() => OpenEditModal(id,content)}>
                                <FaEdit />
                              </Button>
                              <Button onClick={() => deleteItem(id)}>
                                <FaTrash />
                              </Button>
                            </EditDeleteContainer>
                          </ListBox>
                        )}
                      </Draggable>
                    ))}
                    {provider.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </List>
        </ListContainer>
      </Container>
      {
        open && (
          <ModalBackground onClick={closeModal}>
            <ModalContainer onClick={(e)=> e.stopPropagation()}>
            <TextField
            type = "text"
            value = {inputEdit}
            onChange={(e)=>setInputEdit(e.target.value)}
            />
            <Button onClick={saveEditItem} >OK</Button>
          </ModalContainer>
        </ModalBackground>

        )

      }
    </>
  )
}

export default App
