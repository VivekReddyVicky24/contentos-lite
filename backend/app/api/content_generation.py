import traceback

from fastapi import APIRouter, HTTPException

from app.services.content_generation_service import (
    generate_content_for_item,
)


router = APIRouter(
    prefix="/content-generation",
    tags=["Content Generation"],
)


@router.post("/{content_item_id}")
async def generate_content(
    content_item_id: str,
):
    try:

        result = generate_content_for_item(
            content_item_id
        )

        return {
            "success": True,
            "content_item_id": content_item_id,
            "result": result,
        }

    except ValueError as e:

        print(
            f"CONTENT GENERATION VALUE ERROR: {e}"
        )

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        print("\n" + "=" * 70)
        print("CONTENT GENERATION FAILED")
        print("=" * 70)
        print(f"ERROR: {e}")
        print("\nFULL TRACEBACK:")
        traceback.print_exc()
        print("=" * 70 + "\n")

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )