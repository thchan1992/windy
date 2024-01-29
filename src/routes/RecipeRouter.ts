import express, { Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import Recipe from "../models/Recipe";

const router = express.Router();

router.get(
  "/userRecipes",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userData = (req as any).userData as { userId: string };

      if (!userData) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { userId } = userData;
      const recipes = await Recipe.find({ createdBy: userId }).select(
        "title steps"
      );
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recipes", error });
    }
  }
);

router.post("/add", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, steps } = req.body;

    const userId = (req as any).userData.userId;

    const newRecipe = new Recipe({
      title,
      steps,
      createdBy: userId,
    });

    await newRecipe.save();

    res
      .status(201)
      .json({ message: "Recipe added successfully", recipe: newRecipe });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding recipe", error });
  }
});

router.delete(
  "/delete/:recipeId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const recipeId = req.params.recipeId;
      const userId = (req as any).userData.userId;

      // check if the recipe exists and belongs to the user
      const recipe = await Recipe.findOne({ _id: recipeId, createdBy: userId });
      if (!recipe) {
        return res
          .status(404)
          .json({ message: "Recipe not found or not authorized to delete" });
      }

      // deleteOne to remove the recipe
      await Recipe.deleteOne({ _id: recipeId });
      res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting recipe", error });
    }
  }
);

export default router;

// import express, { Request, Response } from "express";
// import { authMiddleware } from "../middleware/authMiddleware";
// import Recipe from "../models/Recipe";

// const router = express.Router();

// router.get(
//   "/userRecipes",
//   authMiddleware,
//   async (req: Request, res: Response) => {
//     try {
//       const userId = req.userData?.userId;
//       const recipes = await Recipe.find({ createdBy: userId });
//       res.json(recipes);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching recipes", error });
//     }
//   }
// );

// export default router;
