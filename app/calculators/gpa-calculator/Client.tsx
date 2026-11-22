"use client";

import { Plus, Trash2 } from "lucide-react";
import { NumberField, Panel, Stat } from "@/components/ui/kit";
import { usePersistentState } from "@/lib/local";

const grades: Record<string, number> = { "A+": 4, A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, "C-": 1.7, "D+": 1.3, D: 1, "D-": 0.7, F: 0 };

interface Course { name: string; credits: string; grade: string }

export default function Client() {
  const [courses, setCourses] = usePersistentState<Course[]>("gpa-courses", [
    { name: "Course 1", credits: "3", grade: "A" },
    { name: "Course 2", credits: "3", grade: "B+" },
    { name: "Course 3", credits: "4", grade: "A-" },
  ]);
  const [prevGpa, setPrevGpa] = usePersistentState("gpa-prev", "");
  const [prevCredits, setPrevCredits] = usePersistentState("gpa-prev-cr", "");

  const update = (i: number, patch: Partial<Course>) => setCourses(courses.map((c, j) => (i === j ? { ...c, ...patch } : c)));
  const credits = courses.reduce((s, c) => s + (+c.credits || 0), 0);
  const points = courses.reduce((s, c) => s + (+c.credits || 0) * grades[c.grade], 0);
  const gpa = credits ? points / credits : 0;
  const pc = +prevCredits || 0;
  const cum = credits + pc ? (points + (+prevGpa || 0) * pc) / (credits + pc) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <Panel>
        <div className="space-y-3">
          {courses.map((c, i) => (
            <div key={i} className="grid grid-cols-[1fr_80px_90px_40px] items-center gap-2">
              <input className="input" value={c.name} onChange={(e) => update(i, { name: e.target.value })} aria-label="Course name" />
              <input className="input px-3" type="number" min={0} value={c.credits} onChange={(e) => update(i, { credits: e.target.value })} aria-label="Credits" />
              <select className="input px-3" value={c.grade} onChange={(e) => update(i, { grade: e.target.value })} aria-label="Grade">
                {Object.keys(grades).map((g) => <option key={g}>{g}</option>)}
              </select>
              <button className="btn-ghost p-2" onClick={() => setCourses(courses.filter((_, j) => j !== i))} aria-label="Remove course"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        <button className="btn-secondary mt-4" onClick={() => setCourses([...courses, { name: `Course ${courses.length + 1}`, credits: "3", grade: "A" }])}>
          <Plus className="h-4 w-4" /> Add course
        </button>
        <div className="mt-6 grid gap-3 border-t pt-5 sm:grid-cols-2">
          <NumberField label="Previous GPA (optional)" value={prevGpa} onChange={setPrevGpa} />
          <NumberField label="Previous credits" value={prevCredits} onChange={setPrevCredits} />
        </div>
      </Panel>
      <div className="space-y-3">
        <Stat accent label="Semester GPA" value={gpa.toFixed(2)} hint={`${credits} credits`} />
        {pc > 0 && <Stat label="Cumulative GPA" value={cum.toFixed(2)} hint={`${credits + pc} total credits`} />}
        <Panel className="text-sm text-gray-600">
          <p className="font-semibold text-gray-900">4.0 grade scale</p>
          <div className="mt-2 grid grid-cols-4 gap-1 tabular-nums">
            {Object.entries(grades).map(([g, p]) => <span key={g}>{g}: {p}</span>)}
          </div>
        </Panel>
      </div>
    </div>
  );
}
