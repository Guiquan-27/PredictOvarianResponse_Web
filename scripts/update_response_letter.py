from docx import Document
import shutil

src = "E:/BaiduNetdiskWorkspace/Ovarian_response/2_18修回/revision_output_0218/Response_Letter_0218.docx"
backup = src.replace(".docx", "_backup.docx")
shutil.copy2(src, backup)

doc = Document(src)

replacements = [
    (
        "[DATA PLACEHOLDER: XX patients (XX%) were simultaneously classified as high risk for both LOR and HOR. This represents a very small/moderate proportion of the total cohort.]",
        "0 patients (0.00%) were simultaneously classified as high risk for both LOR and HOR, indicating that the two independent models do not produce contradictory predictions in practice."
    ),
    (
        "this occurred in [XX] patients ([XX]%)",
        "this occurred in 0 patients (0.00%)"
    ),
]

count = 0
for para in doc.paragraphs:
    full = para.text
    for old, new in replacements:
        if old in full:
            new_text = full.replace(old, new)
            for i, run in enumerate(para.runs):
                run.text = new_text if i == 0 else ""
            full = new_text
            count += 1

doc.save(src)
print(f"Done: {count} replacements. Backup: {backup}")
