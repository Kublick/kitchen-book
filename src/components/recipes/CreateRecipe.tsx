"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { EditorContent } from "@tiptap/react";
import { useRecipeEditor } from "@/components/editor/use-recipe-editor";

import { X } from "lucide-react";
import { createRecipe } from "@/actions/recipe/create-recipe";

// import { useToast } from "@/components/ui/use-toast";

// import { DevTool } from "@hookform/devtools";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "El titulo es requerido.",
  }),
  portions: z.number().min(1, "Ingrese la cantidad de porciones"),
  prepTime: z.number().min(1, "Ingrese un tiempo de preparación"),
  cookTime: z.number().min(1, "Ingrese el tiempo de cocción"),
  procedure: z.string({ required_error: "El procedimiento es requerido." }),
  description: z.string({ required_error: "La descripcion es requerida." }),
  imageUrl: z.string().nullable(),
  categoryId: z.number({ required_error: "La categoria es requerida." }),
  images: z.custom<File[]>().nullable(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      unit: z.enum([
        "GRAMOS",
        "KILOGRAMOS",
        "MILLILITROS",
        "LITROS",
        "CUCHARADA",
        "CUCHARADITA",
        "TAZA",
        "PIEZA",
        "PIZCA",
      ]),
    })
  ),
  userId: z.number(),
});

interface PageProps {
  categories: {
    id: number;
    name: string;
  }[];
}

interface ResponseData {
  imageNames: string[];
}

export function CreateRecipeForm({ categories }: PageProps) {
  const { editor } = useRecipeEditor({ content: "" });
  const { editor: ingredientEditor } = useRecipeEditor({ content: "" });

  //   const { toast } = useToast();

  //   const createRecipe = api.recipe.createRecipe.useMutation({
  //     onSuccess: () => {
  //       toast({
  //         title: "Receta registrada exitosamente",
  //       });
  //       // form.reset();
  //       // editor?.commands.clearContent(true);
  //     },
  //   });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      procedure: "",
      description: "",
      imageUrl: "www.google.com",
      categoryId: 1,
      portions: 0,
      cookTime: 0,
      prepTime: 0,
      ingredients: [
        {
          name: "",
          amount: 0,
          unit: "GRAMOS",
        },
      ],
      userId: 1,
      images: null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("categoryId", values.categoryId.toString());
    formData.append("portions", values.portions.toString());
    formData.append("prepTime", values.prepTime.toString());
    formData.append("cookTime", values.cookTime.toString());
    formData.append("userId", values.userId.toString());
    formData.append("procedure", editor?.getHTML() ?? "");
    formData.append("ingredients", ingredientEditor?.getHTML() ?? "");

    if (values.images && values.images.length > 0) {
      for (let i = 0; i < values.images.length; i++) {
        formData.append("images", values.images[i], values.images[i].name);
      }
    }

    await createRecipe(formData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="images"
          render={({ field: { onChange, value, ...fieldProps } }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...fieldProps}
                  placeholder="Seleccione una imagen"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    if (event.target.files) {
                      const _files = Array.from(event.target.files);
                      onChange(_files);
                    }
                  }}
                  multiple={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre receta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripcion</FormLabel>
              <FormControl>
                <Input placeholder="Nombre receta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name={"categoryId"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      console.log(value);
                      field.onChange(Number(value));
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          value={category.id.toString()}
                          key={category.name}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="portions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porciones</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Porciones por receta"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prepTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiempo de preparación</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tiempo de preparación"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cookTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiempo de cocción</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tiempo de preparación"
                    {...field}
                    onChange={(e) => {
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormLabel className="py-4">Ingredientes</FormLabel>

          <div className="divide-y divide-gray-100 border border-gray-600 transition-colors focus-within:border-indigo-600">
            <EditorToolbar editor={ingredientEditor} />
            <EditorContent editor={ingredientEditor} />
          </div>
        </div>

        {/* {fields.map((field, index) => {
          return (
            <div key={field.id} className="flex items-center gap-4">
              <FormField
                control={form.control}
                name={`ingredients.${index}.amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Cantidad"
                        {...field}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`ingredients.${index}.unit`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Medida" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GRAMOS">gr</SelectItem>
                          <SelectItem value="KILOGRAMOS">kg</SelectItem>
                          <SelectItem value="MILLILITROS">ml</SelectItem>
                          <SelectItem value="LITROS">lt</SelectItem>
                          <SelectItem value="CUCHARADITA">
                            cucharadita
                          </SelectItem>
                          <SelectItem value="CUCHARADA">cucharada</SelectItem>
                          <SelectItem value="TAZA">tz</SelectItem>
                          <SelectItem value="PIEZA">pz</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`ingredients.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Nombre Ingrediente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                variant="destructive"
                type="button"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
        <Button
          className="text-muted-foreground "
          variant="ghost"
          type="button"
          onClick={() =>
            append({
              name: "",
              amount: 0,
              unit: "GRAMOS",
            })
          }
        >
          Agregar Ingrediente
        </Button> */}
        <div>
          <FormLabel className="py-4">Procedimiento</FormLabel>

          <div className="divide-y divide-gray-100 border border-gray-600 transition-colors focus-within:border-indigo-600">
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>

        <Button type="submit">Submit</Button>
      </form>
      {/* <DevTool control={form.control} /> */}
    </Form>
  );
}
